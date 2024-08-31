<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class BaseApiTestCase extends TestCase
{
    use RefreshDatabase;

    protected $apiVersion = 'v1';
    protected $baseUrl;

    public function __construct($name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
        $this->baseUrl = "/api/{$this->apiVersion}";
    }
}
